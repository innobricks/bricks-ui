/**
 基于Bootstrap的扩展组件
 @module bricksui
 @submodule bricksui-thirdpart
 */

import "bricksui-thirdpart/initializer";
import {BuPagination,TableHeader} from "bricksui-thirdpart/bu-pagination";
import { StaticPageable,
    DynamicPageable} from "bricksui-thirdpart/mixins/pageable";

import BricksUI from "bricksui-metal/core";

BricksUI.BuPagination = BuPagination;
BricksUI.StaticPageable = StaticPageable;
BricksUI.DynamicPageable = DynamicPageable;

