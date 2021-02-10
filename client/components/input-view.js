import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { history } from '../redux'
import Head from './head'

const InputView = () => {
  const [user, setUser] = useState('')
  const onChange = (e) => {
    setUser(e.target.value)
  }
  const onClick = () => {
    history.push(`/${user}`)
  }
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-black font-bold rounded-lg border shadow-lg p-10">
          <input
            type="text"
            placeholder="type here"
            id="input-field"
            value={user}
            onChange={onChange}
          />
          <button type="button" onClick={onClick} id="search-button">
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

InputView.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputView)
