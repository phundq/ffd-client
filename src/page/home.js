import React, { Component } from 'react';
import {Button} from 'antd';
import axios from 'axios';

class Home extends Component {
    state = {
        kinds: []
    };
    async componentDidMount() {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
            mode: 'cors'
          };
        // axios.get('api/v1/kinds', config)
        //     .then(response => {
        //         console.log(response.data.data);
        //         const data = response.data.data;
        //         this.setState({ kinds: data });
        //         console.log(this.state.kinds);
        //     })

        
    }

    render() {
        // const kindList = this.state.kinds.map(kind =>{
        //     return <li key = {kind.id}>{kind.name}</li>
        // })
        return (<div className="home">
           
        </div>)
    }
}
export default Home;