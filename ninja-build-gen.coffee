# # Ninja-build Generator
#
# This library exports a a set of functions to build a Ninja file
# programmatically.
'use strict'
require('source-map-support').install()
fs          = require 'fs'

# Escape a string, like a path, to be suitable for Ninja.
# This is to be called explicitely because the user may want to use
# variables like `$foo` in paths, rules, etc.
escape = (s) ->
    s.replace /[ :$]/g, (match) ->
        '$' + match

# Represent a Ninja variable assignation (it's more a binding, actually).
class NinjaAssignBuilder
    constructor: (@name, @value) ->

    # Write the assignation into a `stream`.
    write: (stream) ->
        stream.write "#{@name} = #{@value}\n"

# Represent a Ninja edge, that is, "how to construct this file X from Y".
class NinjaEdgeBuilder
    # Construct an edge specifing the resulting files, as `targets`, of the
    # edge.
    constructor: (@targets) ->
        @assigns = []
        @rule = 'phony'
        if typeof @targets == 'string'
            @targets = [@targets]

    # Define the Ninja `rule` name to use to build this edge.
    using: (rule) ->
        @rule = rule
        this

    # Define one or several direct `sources`, that is, files to be transformed
    # by the rule.
    from: (sources) ->
        if typeof sources == 'string'
            sources = [sources]
        unless @sources?
            @sources = sources
        else
            @sources = @sources.concat sources
        this

    # Define one or several indirect `dependencies`, that is, files needed but
    # not part of the compilation or transformation.
    need: (dependencies) ->
        if typeof dependencies == 'string'
            dependencies = [dependencies]
        unless @dependencies?
            @dependencies = dependencies
        else
            @dependencies = @dependencies.concat dependencies
        this

    # Define one or several order-only dependencies in `orderDeps`, that is,
    # this edge should be build after those dependencies are.
    after: (orderDeps) ->
        if typeof orderDeps == 'string'
            orderDeps = [orderDeps]
        unless @orderDeps?
            @orderDeps = orderDeps
        else
            @orderDeps = @orderDeps.concat orderDeps
        this

    # Bind a variable to a temporary value for the edge.
    assign: (name, value) ->
        @assigns[name] = value
        this

    # Write the edge into a `stream`.
    write: (stream) ->
        stream.write "build #{@targets.join(' ')}: #{@rule}"
        stream.write ' ' + @sources.join(' ') if @sources?
        if @dependencies?
            stream.write ' | ' + @dependencies.join ' '
        if @orderDeps?
            stream.write ' || ' + @orderDeps.join ' '
        for name, value of @assigns
            stream.write "\n  #{name} = #{value}"
        stream.write '\n'

# Represent a Ninja rule, that is, a method to "how I build a file of type A
# to type B".
class NinjaRuleBuilder
    # Create a rule with this `name`.
    constructor: (@name) ->
        @command = ''

    # Specify the command-line to run to execute the rule.
    run: (command) ->
        @command = command
        this

    # Provide a description, displayed by Ninja instead of the bare command-
    # line.
    description: (desc) ->
        @desc = desc
        this

    # Provide a Makefile-compatible dependency file for the rule products.
    depfile: (file) ->
        @dependencyFile = file
        this

    restat: (doRestat) ->
        @doRestat = doRestat
        this

    generator: (isGenerator) ->
        @isGenerator = isGenerator
        this

    # Write the rule into a `stream`.
    write: (stream) ->
        stream.write "rule #{@name}\n  command = #{@command}\n"
        stream.write "  description = #{@desc}\n" if @desc?
        stream.write "  restat = 1\n" if @doRestat
        stream.write "  generator = 1\n" if @isGenerator
        if @dependencyFile?
            stream.write "  depfile = #{@dependencyFile}\n"
            stream.write "  deps = gcc\n"

# Provide helpers to build a Ninja file by specifing high-level rules and
# targets.
class NinjaBuilder
    # Create the builder, specifing an optional required Ninja `version`, and a
    # build directory (where Ninja put logs and where you can put
    # intermediary products).
    constructor: (@version, @buildDir) ->
        @edges = []
        @rules = []
        @variables = []
        @edgeCount = 0
        @ruleCount = 0

    # Set an arbitrary header.
    header: (value) ->
        @headerValue = value
        this

    # Specify the default rule by its `name`.
    byDefault: (name) ->
        @defaultRule = name
        this

    # Add a variable assignation into `name` from the `value`.
    assign: (name, value) ->
        clause = new NinjaAssignBuilder(name, value)
        @variables.push clause
        clause

    # Add a rule and return it.
    rule: (name) ->
        clause = new NinjaRuleBuilder(name)
        @rules.push clause
        @ruleCount++
        clause

    # Add an edge and return it.
    edge: (targets) ->
        clause = new NinjaEdgeBuilder(targets)
        @edges.push clause
        @edgeCount++
        clause

    # Write to a `stream`. It does not end the stream.
    saveToStream: (stream) ->
        stream.write @headerValue + '\n\n' if @headerValue?
        stream.write "ninja_required_version = #{@version}\n" if @version?
        stream.write "builddir=#{@buildDir}\n" if @buildDir?
        for clause in [].concat(@rules, @edges, @variables)
            clause.write stream
        stream.write "default #{@defaultRule}\n" if @defaultRule?

    # Save the Ninja file on the filesystem at this `path` and call
    # `callback` when it's done.
    save: (path, callback) ->
        file = fs.createWriteStream(path)
        @saveToStream file
        if callback
            file.on 'close', -> callback()
        file.end()

module.exports = (version, builddir) ->
    new NinjaBuilder(version, builddir)

module.exports.escape = escape
module.exports.NinjaEdgeBuilder = NinjaEdgeBuilder
module.exports.NinjaRuleBuilder = NinjaRuleBuilder
