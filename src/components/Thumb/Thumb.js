// @flow
import React, { Component } from 'react';

const styles = {};

/**
 *
 */
class Thumb extends Component {
    // props
    props: {
        size: string,
        thumbUrl: string
    };

    // default values for props
    static defaultProps = {
        size: "medium",
        thumbUrl : "",
    };

    constructor(props) {
        super(props);
        let thumbUrl;
        if(props.entry){
            thumbUrl = props.entry.thumbnailUrl;
        }else{
            thumbUrl = this.props.thumbUrl;
        }
        this.state = {thumbUrl:thumbUrl};
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {}

    handleChange(event: Event) {}

    render() {
        let imageUrl = this.state.thumbUrl;
        if (this.props.size) {
            switch (this.props.size) {
                case 'tiny':
                    imageUrl += '/width/50';
                    break;
                case 'small':
                default:
                    imageUrl += '/width/100/height/80';
                    break;
                case 'medium':
                    imageUrl += '/width/180/height/102';
                    break;
                case 'big':
                    imageUrl += '/width/500';
                    break;
                case 'huge':
                    imageUrl += '/width/800';
                    break;
                case 'humongous':
                    imageUrl += '/width/1024';
                    break;
            }
        } else {
            imageUrl += this.props.height ? '/height/' + this.props.height : '';
            imageUrl += this.props.width ? '/width/' + this.props.width : '';
        }
        imageUrl += this.props.type ? '/type/' + this.props.type : '';
        imageUrl += this.props.bgcolor ? '/bgcolor/' + this.props.bgcolor : '';
        imageUrl += this.props.vid_sec ? '/vid_sec/' + this.props.vid_sec : '';
        imageUrl += this.props.vid_slice
            ? '/vid_slice/' + this.props.vid_slice
            : '';
        imageUrl += this.props.src_x ? '/src_x/' + this.props.src_x : '';
        imageUrl += this.props.src_y ? '/src_y/' + this.props.src_y : '';
        imageUrl += this.props.src_w ? '/src_w/' + this.props.src_w : '';
        imageUrl += this.props.src_h ? '/src_h/' + this.props.src_h : '';
        imageUrl += this.props.rel_width
            ? '/rel_width/' + this.props.rel_width
            : '';
        imageUrl += this.props.rel_height
            ? '/rel_height/' + this.props.rel_height
            : '';
        console.log('>>>>>', imageUrl);
        return <img src={imageUrl} />;
    }
}

export default Thumb;
