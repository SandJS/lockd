TESTS = test/index

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--harmony \
		$(TESTS) \
		--recursive \

.PHONY: test