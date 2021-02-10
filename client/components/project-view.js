import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import ReactMarkdown from 'react-markdown'
import Head from './head'
import Header from './header'

const ProjectView = () => {
  const params = useParams()
  const [repo, setRepo] = useState('')
  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/${params.user}/${params.project}/readme`)
      .then(({ data }) => {
        setRepo(data)
      })
  }, [params])

  const [readme, setReadme] = useState('')
  useEffect(() => {
    axios.get(`${repo.download_url}`).then(({ data }) => {
      setReadme(data)
    })
  }, [repo])
  return (
    <div>
      <Head title="Hello" />
      <Header />
      3. This is Readme file of {params.project}
      <div>Link:</div>
      <div>{repo.download_url}</div>
      <div>Text:</div>
      <div id="description">
        render(<ReactMarkdown>{readme}</ReactMarkdown>)
      </div>
    </div>
  )
}
ProjectView.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView)
