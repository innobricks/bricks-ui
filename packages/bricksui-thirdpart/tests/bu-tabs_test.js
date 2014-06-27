import BricksUI from "bricksui-metal/core";

var App;
QUnit.module("bu-tabs",{
    setup:function(){
        Ember.run(function(){
            App=Ember.Application.create();
        });
    }
});

