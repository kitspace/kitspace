all: planned.png current.png

%.png: %.dot
	dot -Tpng $< -o $@

clean:
	rm -f *.png

.PHONY: all clean
