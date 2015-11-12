require 'kicad'

inf = ARGV[0]
mods = ARGV[1..-1]

p = BrdRewrite.new(File.readlines(ARGV[0]))
b = p.parse

seq = 0
b.each_elm('MODULE') do |m|
  modname = m.assoc('T0')[11][/[^\"]+/]
  next unless mods.include? modname
  
  m.each_elm('PAD') do |p|
    netname = p.assoc('Ne')[2][/\d+/]
    padpos = p.assoc('Po')[1..2]
    m << BrdCmd.new("T2 #{padpos} 354 354 0 59 N V 21 \"#{netname}\"")
  end
end

print b
