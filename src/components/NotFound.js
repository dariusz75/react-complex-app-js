import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";

function NotFound() {
  return (
    <Page title="Not found">
      <div className="text-center">
        <h2>Page not found</h2>
        <p className="lead text-muted">
          Please navigate to the <Link to="/">homepage</Link>
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
