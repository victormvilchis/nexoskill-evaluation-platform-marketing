import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('NexoSkill render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-error" role="alert">
        <div className="container app-error__card">
          <span>Error de visualización</span>
          <h1>No fue posible mostrar esta sección.</h1>
          <p>La información no se perdió. Actualiza la página o regresa al inicio para continuar navegando.</p>
          <div>
            <button className="button button--primary" onClick={() => window.location.reload()} type="button">Actualizar página</button>
            <a className="button button--secondary" href="/">Volver al inicio</a>
          </div>
        </div>
      </main>
    );
  }
}
