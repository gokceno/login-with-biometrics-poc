import * as dotenv from 'dotenv';
import React from "react";
import PropTypes from 'prop-types';
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

dotenv.config();

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<App/>
);
