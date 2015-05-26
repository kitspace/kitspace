wildc_recursive=$(foreach d,$(wildcard $1*),$(call wildc_recursive,$d/,$2) $(filter $(subst *,%,$2),$d))
ELM_FILES   = $(wildcard src/*.elm)
HTML_FILES  = $(wildcard src/*.html)
IMAGE_FILES = $(wildcard src/images/*)
PCB_FILES   = $(call wildc_recursive, pcbs/, *)

all: elm html images

dirs: build/.dirstamp build/images/.dirstamp build/pcbs/.dirstamp
elm: dirs build/elm.js
html: dirs $(patsubst src/%, build/%, $(HTML_FILES))
images: dirs $(patsubst src/%, build/%, $(IMAGE_FILES))

pcbs: all
	coffee makeBoards.coffee
	cp -r pcbs build/

serve: all pcbs
	http-server build/

build/elm.js: $(ELM_FILES)
	elm-make $(ELM_FILES) --yes --output $@

%/.dirstamp:
	mkdir $*
	@touch $@

clean:
	rm -rf build/

build/pcbs/%: src/%
	cp $< $@

build/%: src/%
	cp $< $@

watch:
	@while true; do make | grep -v "^make\[1\]:"; sleep 1; done

.PHONY: all elm html pcbs clean watch
