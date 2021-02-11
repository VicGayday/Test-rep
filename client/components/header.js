import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useParams, Link } from 'react-router-dom'

const Header = () => {
  const { user, project } = useParams()
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-indigo-800 p-6">
        <div className="text-white font-bold shadow-lg">{user}</div>
        <Link to="/" className="no-underline hover:underline text-white font-bold">
          Go to Root
        </Link>
        <div>
          {typeof project !== 'undefined' ? (
            <Link to={`/${user}`} className="no-underline hover:underline text-white font-bold">
              Go to Repository List{' '}
            </Link>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
