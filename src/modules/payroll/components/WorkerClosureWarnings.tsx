import type { WorkerClosureCardModel } from '../services/monthlyClosure.types'

type WorkerClosureWarningsProps = {
  model: WorkerClosureCardModel
}

export function WorkerClosureWarnings({ model }: WorkerClosureWarningsProps) {
  if (model.warnings.length === 0) {
    return null
  }

  return (
    <div className="stack-list stack-list--compact">
      {model.warnings.map((warning) => (
        <article key={warning} className="warning-item">
          <div>
            <h4>Atencion</h4>
            <p>{warning}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
