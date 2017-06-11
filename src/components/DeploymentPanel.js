import { Button, Intent } from "@blueprintjs/core";
import React, { Component } from "react";
import { PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { createDeployment } from "../actions";
import { renderTextInput } from "../lib";

const styles = {
  urlField: {
    width: 400
  }
};

class DeploymentPanel extends Component {
  render() {
    const { deployments, handleSubmit, posm, submitting } = this.props;

    return (
      <div className="posm-panel">
        <PageHeader>OpenMapKit Deployments</PageHeader>
        <Panel>
          <p>
            Deployments are bundles of OSM XML data and MBTiles archives
            intended to
            facilitate enumeration and validation of features. These can be
            downloaded using the
            {" "}<span className="pt-icon-standard pt-icon-cog" />
            {" "}menu within OpenMapKit Android when connected to the POSM WiFi
            network.
          </p>
          <hr />
          <h3>
            Available Deployments
          </h3>
          {deployments.length > 0
            ? <ul>
                {deployments.map(({ description, name, title }, i) =>
                  <li key={i}>
                    <a
                      href={`${posm}/fp/atlases/${name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {title}
                      {" "}
                      {description && <span> - <em>{description}</em></span>}
                    </a>
                  </li>
                )}
              </ul>
            : <p>None loaded.</p>}
          <hr />
          <h3>Create a New Deployment</h3>
          <p>
            To create a new OMK Deployment, either create an atlas using the
            {" "}
            <a href={`${posm}/fp/`} target="_blank" rel="noopener noreferrer">
              local Field Papers instance
            </a>
            {" "}or paste in the publicly-accessibly URL of a Field Papers atlas
            (from <a href="http://fieldpapers.org/">fieldpapers.org</a> or
            elsewhere).
          </p>
          <form onSubmit={handleSubmit}>
            <div className="pt-form-group pt-control-group">
              <Field
                name="url"
                component={renderTextInput}
                label="Field Papers Atlas GeoJSON URL"
                placeholder="http://fieldpapers.org/atlases/4ncr1bzn.geojson"
                style={styles.urlField}
              />
            </div>
            <Button
              text="Create"
              type="submit"
              disabled={submitting}
              intent={Intent.PRIMARY}
              rightIconName="arrow-right"
            />
          </form>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deployments: state.deployments,
  posm: state.config.posm
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "createDeployment",
    onSubmit: ({ url }, dispatch, { posm }) =>
      dispatch(createDeployment(posm, url))
  })(DeploymentPanel)
);
