function StatCard({ title, value, icon }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card shadow-sm border-0 p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h3>{value}</h3>
          </div>

          <i className={`bi ${icon} fs-1 text-primary`}></i>
        </div>
      </div>
    </div>
  )
}

export default StatCard
