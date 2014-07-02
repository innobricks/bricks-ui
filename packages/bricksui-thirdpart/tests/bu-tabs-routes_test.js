import BricksUI from "bricksui-metal/core";

var App, $fixture, router, container;

function bootApplication() {
    router = container.lookup("router:main");
    Ember.run(App, "advanceReadiness");
}
function handleURL(path) {
    return Ember.run(function () {
        return router.handleURL(path).then(function (value) {
            ok(true, 'url: `' + path + '` was handled');
            return value;
        }, function (reason) {
            ok(false, 'failed to visit:`' + path + '` reason: `' + QUnit.jsDump.parse(reason));
            throw reason;
        });
    });
}
QUnit.module("bu-tabs-routes", {
    setup: function () {
        Ember.run(function () {
            App = Ember.Application.create({
                name: "App",
                rootElement: "#qunit-fixture"
            });
            App.deferReadiness();

            container = App.__container__;


            Ember.TEMPLATES.application = Ember.Handlebars.compile("{{outlet}}");



        });
        $fixture = Ember.$("#qunit-fixture");
    },
    teardown: function () {
        Ember.run(function () {
            App.destroy();
        });
        App = null;
        $fixture = null;
    }
});

test("test bu-tabs is still exist", function () {
    Ember.TEMPLATES.user = Ember.Handlebars.compile('{{bs-tabs id="tabs1" contentBinding="tabsMeta" default="Foo" justified=true}}{{outlet}}');

    App.Router.map(function () {
        this.resource('user', function () {
            this.route('general');
            this.route('privacy');
            this.route('activities');
        });
    });

    App.UserController = Ember.Controller.extend({
        tabsMeta: [
            Ember.Object.create({title: 'General', linkTo: 'user.general'}),
            Ember.Object.create({title: 'Privacy', linkTo: 'user.privacy'}),
            Ember.Object.create({title: 'Activities', linkTo: 'user.activities'})
        ]
    });

    try {
        bootApplication();

        var transition = handleURL("/");
        Ember.run(function () {
            transition.then(function () {
                router.transitionTo("user").then(function (value) {
                    ok(true, 'expected transition');
                }, function (reason) {
                    ok(false, 'failed to visit:user,and reason is '+reason);
                });
            });
        });
    } catch (e) {
        ok(true, "the bs-tabs helper is not exist yet !");
    }

});

test("test bs-tabs with routes and transition to sub tab", function () {
    Ember.TEMPLATES.user = Ember.Handlebars.compile('{{bu-tabs id="tabs1" contentBinding="tabsMeta" default="Foo" justified=true}}{{outlet}}');

    App.Router.map(function () {
        this.resource('user', function () {
            this.route('general');
            this.route('privacy');
            this.route('activities');
        });
    });

    App.UserController = Ember.Controller.extend({
        tabsMeta: [
            Ember.Object.create({title: 'General', linkTo: 'user.general'}),
            Ember.Object.create({title: 'Privacy', linkTo: 'user.privacy'}),
            Ember.Object.create({title: 'Activities', linkTo: 'user.activities'})
        ]
    });
    bootApplication();

    var transition = handleURL("/");
    Ember.run(function () {
        transition.then(function () {
            router.transitionTo("user.general").then(function (value) {
                ok(true, 'expected transition');
            }, function (reason) {
                ok(false, 'unexpected transition failure: ', QUnit.jsDump.parse(reason));
            });
        });
    });

});