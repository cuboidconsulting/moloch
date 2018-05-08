import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  Loader,
  Icon,
  Grid
 } from 'semantic-ui-react'

// layouts
import MessageList from '../messages/MessageList';

class Home extends Component {
  static contextTypes = {
    drizzle: PropTypes.object.isRequired,
    drizzleStore: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props)

    this.props = props
    this.context = context
    this.contracts = context.drizzle.contracts
    // init state
    this.state = {
      messages: []
    }
  }


  componentWillReceiveProps = (nextProps) => {
    const { messages } = this.state
    if (nextProps === this.props || !nextProps) {
      // no new props
      return
    }

    if (
      this.validateWeb3(nextProps.web3) && 
      messages.length === 0
    ) {
      // TO DO: create validateDrizzle
      if (nextProps.drizzleStatus.initialized && nextProps.Moloch.initialized) {
        // drizzle and contract inited
        return
        // console.log('trying contract call')
        // const dataKey = this.contracts.Moloch.methods.getMember.cacheCall(nextProps.accounts[0])
        // console.log(dataKey)
        // return nextProps.Moloch.methods.getMember[dataKey].value
      } 
    }
  }

  validateWeb3 = (web3) => {
    const { messages } = this.state
    if (!web3 || web3.status === '' || !web3.networkId) {
      return false
    }
    
    if (web3.status === 'failed') {
      console.log('No web3 detected')
      const msg = {
        icon: 'bullhorn',
        sentiment: 'warning',
        title: 'Oops! Looks like you dont have MetaMask installed',
        content: 'Download MetaMask at https://metamask.io'
      }
      if (messages.indexOf(msg) === -1) {
        messages.push(msg)
      }
      this.setState({ messages })
      return false
    } else if (web3.status === 'initialized' && web3.networkId) {
      // validate network IDs (ganache, truffle, rinkeby)
      if (web3.networkId !== 5777 && web3.networkId !== 4) {
        console.log('Connected to incorrect network. Network: ' + web3.networkId)
        const msg = {
          icon: 'bullhorn',
          sentiment: 'warning',
          title: "Looks like you're not on Rinkeby or Truffle!",
          content: 'Switch to the Rinkeby network (or use your local machine) so everything works.'
        }
        if (messages.indexOf(msg) === -1) {
          messages.push(msg)
        }
        return false
      }
      // no metamask errors, clear messages
      this.setState({ messages: [] })
      return true
    } else {
      // no metamask errors, clear messages
      this.setState({ messages: [] })
      return true
    }
  }

  render () {
    return (
      <main className="container">
        <MessageList messages={this.state.messages} />

        <Loader active={!this.props.Moloch.initialized} />

        <Grid>
        <Grid.Row>
            <h4 className='ui horizontal divider header'>
                <Icon className='gavel' />
                Current Proposal
            </h4>
          </Grid.Row>
          <Grid.Row>
            <h4 className='ui horizontal divider header'>
                <Icon className='user plus' />
                Guild Member Proposals
            </h4>
          </Grid.Row>
          <Grid.Row>
            <h4 className='ui horizontal divider header'>
                <Icon className='crosshairs' />
                Raid Proposals
            </h4>
          </Grid.Row>
        </Grid>
      </main>
    )
  }
}

export default Home