import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import axios from 'axios'
import Head from './head'
// import Header from './header'
import InputView from './input-view'
import ListRepositories from './list-repositories'
import ProjectView from './project-view'

const Home = () => {
  // const { user } = useParams()
  // const [repositoryList, setRepositoryList] = useState([])

  // useEffect(() => {
  //   if (typeof user !== 'undefined') {
  //     axios(`https://api.github.com/users/${user}/repos`).then(({ data }) => {
  //       setRepositoryList(data)
  //     })
  //   }
  // }, [user])

  return (
    <div>
      <Head title="Hello" />
      <Switch>
        <Route exact path="/" component={() => <InputView />} />
        <Route exact path="/:user" component={() => <ListRepositories />} />
        <Route exact path="/:user/:project" component={() => <ProjectView />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
