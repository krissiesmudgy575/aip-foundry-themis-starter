import { triageDemo } from "./demoData";
import "./index.css";

function JsonCard(props: { title: string; value: unknown }) {
  return (
    <section className="json-card">
      <div className="card-header">
        <h2>{props.title}</h2>
      </div>
      <pre>{JSON.stringify(props.value, null, 2)}</pre>
    </section>
  );
}

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">AIP Foundry + Themis + OSDK-style app contract</p>
        <h1>Intake triage demo that starts local and ends app-ready</h1>
        <p className="hero-copy">
          This example shows the exact wedge the repo is trying to own: start
          with a Foundry-facing request, normalize the agent response into a
          stable contract, render an app-facing view model, and keep an eval
          handoff artifact beside it.
        </p>
        <div className="hero-grid">
          <article className="metric-card">
            <span className="metric-label">Queue</span>
            <strong>{triageDemo.appViewModel.destinationQueue}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Primary action</span>
            <strong>{triageDemo.appViewModel.primaryActionLabel}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Latency</span>
            <strong>{triageDemo.appViewModel.observabilityContext.latencyMs} ms</strong>
          </article>
        </div>
      </section>

      <section className="summary-panel">
        <div>
          <p className="summary-label">App headline</p>
          <h2>{triageDemo.appViewModel.headline}</h2>
        </div>
        <div className="pill-row">
          <span className="pill">{triageDemo.appViewModel.severityLabel}</span>
          <span className="pill">
            Model {triageDemo.appViewModel.observabilityContext.modelName}
          </span>
        </div>
      </section>

      <section className="cards-grid">
        <JsonCard title="Foundry request payload" value={triageDemo.foundryRequest} />
        <JsonCard title="Normalized contract" value={triageDemo.normalizedResult} />
        <JsonCard title="App view model" value={triageDemo.appViewModel} />
        <JsonCard title="Eval handoff artifact" value={triageDemo.evalHandoff} />
      </section>
    </main>
  );
}

