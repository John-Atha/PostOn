import React from 'react';
import MyNavbar from './MyNavbar';
import OnePost from './OnePost';
import MobileNavbar from './MobileNavbar';

import {isLogged, getOnePost} from './api';

class OnePostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            userId: null,
            logged: false,
            owner: null,
            media: null,
            video: null,
            text: null,
            text_init: null,
            date: null,
            likesNum: 0,
            commentsNum: 0,
            likerSample: {
                username: "Loading..."
            },
            commentSample: {
                owner: {
                    username: "Loading..."
                },
            },
            likes_error: null,
            comments_error: null,
            likesShow: false,
            commentsShow: false,
            edit: false,
            editPostError: null,
            editPostSuccess: null,
            showCard: false,
            showCard2: false,
            error: null,
            updateColorsBetweenNavbars: 1,
        }
        this.checkLogged = this.checkLogged.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.deleteMe = this.deleteMe.bind(this);
        this.updateNavbarsColors = this.updateNavbarsColors.bind(this);
    }
    deleteMe = () => {
        window.location.href="/";
    }
    checkLogged = () => {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        }) 
    }
    getPostInfo = () => {
        getOnePost(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({
                owner: response.data.owner,
                media: response.data.media,
                video: response.data.video,
                text: response.data.text,
                text_init: response.data.text,
                date: response.data.date,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "Sorry, we could not find this post."
            })
        })
    }
    componentDidMount() {
        console.log(`Page of post ${this.state.id}`)
        this.checkLogged();
        this.getPostInfo();
    }
    updateNavbarsColors = () => {
        this.setState({
            updateColorsBetweenNavbars: this.state.updateColorsBetweenNavbars+1,
        })
    }
    render() {
        return(
            <div className="all-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{this.updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {this.state.updateColorsBetweenNavbars} />
                <div className="margin-top-small"></div>
                { this.state.owner!==null &&
                    <OnePost userId={this.state.userId} 
                         logged={this.state.logged}
                         id={this.state.id}
                         owner={this.state.owner}
                         media={this.state.media}
                         video={this.state.video}
                         text={this.state.text}
                         date={this.state.date}
                         updateHome={()=>{}}
                         updateParent={this.deleteMe}
                         commentsShow={true} />
                }
            </div>
        )
    }
}

export default OnePostPage;