ELM_FILES = $(wildcard src/*.elm)
HTML_FILES = $(wildcard src/*.html)

all: elm html

elm: build/elm.js
html: $(patsubst src/%, build/%, $(HTML_FILES))

build/elm.js: $(ELM_FILES)
	elm-make $(ELM_FILES) --yes --output $@

clean:
	rm -rf build/

build/%: src/%
	cp $< $@

watch:
	@while true; do make | grep -v "^make\[1\]:"; sleep 1; done

.PHONY: all elm html clean watch
