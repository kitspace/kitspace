class BrdCmd < Array
  RegExp = /([^"\s]+|"[^"]*")\s*/
  
  def initialize(str)
    self.replace(str.chomp.scan(RegExp).flatten)
  end

  def to_s
    self.join(" ") + "\n"
  end

  def inspect
    "<BrdCmd: #{self.join(' ')}>"
  end
end
  
class BrdElm < Array
  RegExp = /^[$](.*)$/
  RegExpEnd = /^[$]End(.*)$/i

  def initialize(str)
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
    pre = "" if elm == 'BOARD'
    pre +
      self.map(&:to_s).join +
      ("$End%s\n" % @elms.join(" "))
  end

  def inspect
    "<BrdElm #{@elms.join(' ')}: #{@self.map(&:inspect).join(', ')}>"
  end
end


class BrdRewrite
  def initialize(f)
    @f = f
    @b = nil
  end

  def parse
    @b = BrdElm.new('$BOARD')
    s = [@b]
    @f.each do |l|
      case l
      when /^\s*$/
        # nothing
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

if $0 == __FILE__
  p = BrdRewrite.new(File.readlines(ARGV[0]))
  b = p.parse
  b.each_elm('MODULE') do |m|
    li = m.assoc('Li')
    po = m.assoc('Po')
    modname = m.assoc('T0')
    nm = /"[[:alpha:]]+(\d+)"/.match(modname[11])
    n = nm[1].to_i
    case li[1]
    when "LED-3MM"
      n -= 1
      col = n / 7
      row = n % 7
      x = 20866 + col * (22441 - 20866)
      y = 24705 + row * (26278 - 24705)
      po[1] = x.to_s
      po[2] = y.to_s
      po[3] = "3150"
      modname[5] = "3150"
      m.assoc('T1')[5] = "3150"
    when "LEDLINK"
      n -= 19
      x = 20866 + n * (22441 - 20866)
      po[1] = x.to_s
      po[2] = "23622"
    end
  end
  print b
end
