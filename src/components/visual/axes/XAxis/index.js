//X轴组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BaseAxis from '../BaseAxis'

export default class XAxis extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <BaseAxis type='XAxis' {...this.props} />
        )
    }
}