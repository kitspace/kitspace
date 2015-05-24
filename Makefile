ELM_FILES = $(wildcard src/*.elm)
HTML_FILES = $(wildcard src/*.html)
IMAGE_FILES = $(wildcard src/images/*)

all: elm html images

elm: dirs build/elm.js
html: dirs $(patsubst src/%, build/%, $(HTML_FILES))
images: dirs $(patsubst src/%, build/%, $(IMAGE_FILES))
dirs: build/.dirstamp build/images/.dirstamp

build/elm.js: $(ELM_FILES)
	elm-make $(ELM_FILES) --yes --output $@

%/.dirstamp:
	mkdir $*
	@touch $@

clean:
	rm -rf build/

build/%: src/%
	cp $< $@

watch:
	@while true; do make | grep -v "^make\[1\]:"; sleep 1; done

.PHONY: all elm html clean watch
