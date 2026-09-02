export default function App() {
  const fullName = "Claude Ishimwe";
  const labName = "AWS ECS Fargate Blue/Green Lab";

  return (
    <main className="page">
      <section className="card">
        <span className="badge">Deployed on ECS Fargate</span>
        <h1 className="name">{fullName}</h1>
        <p className="lab">{labName}</p>
        <div className="divider" />
        <p className="meta">
          Running in a private subnet behind a public Application Load Balancer.
        </p>
      </section>
      <footer className="footer">
        blue / green via CodeDeploy &middot; image built with GitHub Actions OIDC
      </footer>
    </main>
  );
}
