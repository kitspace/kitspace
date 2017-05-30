all: planned.svg current.svg key.svg

%.svg: %.dot
	dot -Tsvg $< -o $@

clean:
	rm -f *.svg

.PHONY: all clean
