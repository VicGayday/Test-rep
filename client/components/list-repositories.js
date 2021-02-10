import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import Head from './head'
import Header from './header'

const ListRepositories = () => {
  const { user } = useParams()
  const [repositoryList, setRepositoryList] = useState([])

  useEffect(() => {
    if (typeof user !== 'undefined') {
      axios(`https://api.github.com/users/${user}/repos`).then(({ data }) => {
        setRepositoryList(data)
      })
    }
  }, [user])
  return (
    <div>
      <Header />
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          This is ListRepositories of {user}
          <div>
            {repositoryList.map((item, index) => (
              <div key={item.name} className="no-underline hover:underline text-blue-500 text-lg">
                <Link to={`/${user}/${item.name}`}>
                  {index + 1}.{item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

ListRepositories.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ListRepositories)
