import { mount } from "@geastack/core";
import { App } from "./app";
import { flow } from "./stores/flow";

mount(App);
flow.start();
