class BrdCmd < Array
  RegExp = /([^"\s]+|"[^"]*")\s*/

  def initialize(str)
    self.replace(str.chomp.scan(RegExp).flatten)
    @xargs = []
  end

  def <<(xarg)
    @xargs << xarg.chomp
  end

  def to_s
    s = self.join(" ") + "\n"
    s += "\t" + @xargs.join("\n\t") + "\n" unless @xargs.empty?
    s
  end

  def inspect
    "<BrdCmd: #{self.join(' ')}#{@xargs.empty? ? "" : " ..."}>"
  end
end
  
class BrdElm < Array
  RegExp = /^[$](.*)$/
  RegExpEnd = /^[$]End(.*)$/

  def initialize(str, root=false)
    @root = root
    m = RegExp.match(str.chomp)
    raise RuntimeError, "invalid arg" if not m
    @elms = m[1].split
  end

  def elm
    @elms[0]
  end

  def check_end(str)
    m = RegExpEnd.match(str.chomp)
    raise RuntimeError, "invalid arg" if not m || m[1..-1] != @elms
    true
  end

  def each_elm(name=nil)
    self.each do |e|
      next if not BrdElm === e
      next if name and not e.elm == name
      yield e
    end
  end

  def to_s
    pre = "$%s\n" % @elms.join(" ")
    pre = "" if @root
    pre +
      self.map(&:to_s).join +
      ("$End%s\n" % @elms.join(" "))
  end

  def inspect
    "<BrdElm #{@elms.join(' ')}: #{@self.map(&:inspect).join(', ')}>"
  end
end


class BrdRewrite
  def initialize(f, delim='BOARD')
    @f = f
    @b = nil
    @delim = '$' + delim
  end

  def parse
    @b = BrdElm.new(@delim, true)
    s = [@b]
    @f.each do |l|
      case l
      when /^\s*$/
        # nothing
      when /^\s+/
        # continuation arguments
        s.last.last << l
      when BrdElm::RegExpEnd
        begin
          s.last.check_end(l)
        rescue Exception, e
          $stderr.puts "incorrect order: #{e}"
        end
        s.pop
      when BrdElm::RegExp
        e = BrdElm.new(l)
        s.last << e
        s << e
      else
        s.last << BrdCmd.new(l)
      end
    end
    @b
  end
end

class SchRewrite
  def initialize(f)
    @f = f
  end

  def each_elm_recursive(name=nil, &blk)
    recurse(@f, '', name, &blk)
  end

  def recurse(fn, reclvl, name, &blk)
    puts "recursing: #{fn}"
    sch = BrdRewrite.new(File.readlines(fn), 'SCHEMATC').parse
    sch.each_elm('Sheet') do |e|
      rfn = e.assoc('F1')[1][1..-2]
      ts = e.assoc('U')[1]
      recurse(rfn, '/'+ts, name, &blk)
    end
    sch.each_elm(name) do |e|
      next if e.elm == 'Sheet'
      next if name && name != e.elm
      yield e, reclvl
    end

    puts "writing: #{fn}"
    File.open(fn + '-renumbered', 'w') do |f|
      f.print sch
    end
  end
end

if $0 == __FILE__
  brd = BrdRewrite.new(File.readlines(ARGV[0])).parse
  modules = {}
  brd.each_elm('MODULE') do |m|
    po = m.assoc('Po')
    id = m.assoc('AR')[1]
    modname = m.assoc('T0')
    nm = modname[11][1..-2]
    layer = po[4].to_i
    if layer == 15
      layer = 0
    else
      layer = 1
    end
    modules[id] = {:layer => layer, :x => po[1].to_i, :y => po[2].to_i, :ref => nm, :id => id}
  end

  refnums = Hash.new{|h, k| h[k] = 1}
  modules.sort_by{|_, e| [e[:layer], e[:x], e[:y]]}.each do |_, m|
    pref = m[:ref][/^[[:alpha:]]+/]
    num = m[:ref][/[[:digit:]]+$/]
    newnum = refnums[pref]
    refnums[pref] += 1
    m[:newref] = "#{pref}#{newnum}"
  end

  sch = SchRewrite.new(ARGV[1])
  sch.each_elm_recursive('Comp') do |c, rec|
    l = c.assoc('L')
    nm = l[2]
    next if nm[0] == '#'
    u = c.assoc('U')
    id = u[3]
    rid = rec + '/' + id
    mod = modules[rid]
    next unless mod
    nmfield = c.select{|a| a[0] == 'F' && a[1] == '0'}
    if !nmfield.empty?
      nmtext = nmfield.first[2][1..-2]
    end

    newref = mod[:newref]
    next if nm == newref && (nmfield.empty? || nmtext == newref)

    puts "renumbering #{nm} to #{newref}"

    l[2] = newref
    nmfield.each do |f|
      f[2] = %{"#{newref}"}
    end
  end
end
