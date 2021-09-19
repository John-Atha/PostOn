import React from 'react';
import MyNavbar from '../Components/Navbars/MyNavbar';
import OnePost from '../Components/Posts/OnePost';
import MobileNavbar from '../Components/Navbars/MobileNavbar';
import { isLogged, getOnePost, getUser } from '../api/api';
import Media from '../Components/Posts/Media';
import Spinner from 'react-bootstrap/esm/Spinner';

class OnePostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.id),
            logged: false,
            user: null,
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
            showingFullScreenMedia: false,
        }
        this.checkLogged = this.checkLogged.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.deleteMe = this.deleteMe.bind(this);
        this.updateNavbarsColors = this.updateNavbarsColors.bind(this);
        this.setShowingFullScreenMedia = this.setShowingFullScreenMedia.bind(this);
    }
    setShowingFullScreenMedia = (val) => {
        this.setState({
            showingFullScreenMedia: val,
        })
    }

    deleteMe = () => {
        window.location.href="/";
    }
    checkLogged = () => {
        isLogged()
        .then(response => {
            //console.log(response);
            this.setState({
                logged: response.data.authenticated,
            })
            getUser(response.data.id)
            .then(response => {
                this.setState({
                    user: response.data,
                })
            })
            .catch(() => {
                this.setState({
                    logged: false,
                    error: "Not logged in",
                })
            })
        })
        .catch(err => {
            //console.log(err)
            this.setState({
                error: "Not logged in",
            })
        }) 
    }
    getPostInfo = () => {
        getOnePost(this.state.id)
        .then(response => {
            //console.log(response);
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
            //console.log(err);
            this.setState({
                error: "Sorry, we could not find this post."
            })
        })
    }
    componentDidMount() {
        //console.log(`Page of post ${this.state.id}`)
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
            <div className="all-page" style={{'paddingBottom': '100px'}}>
                {window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{this.updateNavbarsColors();}} />
                }
                <MyNavbar updateMyColors = {this.state.updateColorsBetweenNavbars} />
                <div className="margin-top-smaller"></div>
                {this.state.owner!==null && this.state.showingFullScreenMedia &&
                        <Media 
                            image={this.state.media}
                            video={this.state.video}
                            setShowing={this.setShowingFullScreenMedia} />                
                }
                {this.state.owner!==null &&
                    <OnePost user={this.state.user} 
                         logged={this.state.logged}
                         post={{
                            id: this.state.id,
                            owner: this.state.owner,
                            text: this.state.text,
                            media: this.state.media,
                            video: this.state.video,
                            date: this.state.date,
                         }}
                         updateHome={()=>{}}
                         updateParent={this.deleteMe}
                         commentsShow={true}
                         setShowingMedia={this.setShowingFullScreenMedia}
                         setImage={()=>{}}
                         setVideo={()=>{}}
                    />
                }
                {this.state.error &&
                    <div className='error-message center-content margin'>{this.state.error}</div>
                }
                {!this.state.owner && !this.state.error &&
                    <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                        <Spinner animation="border" role="status" variant='primary' />
                    </div>
                }
            </div>
        )
    }
}

export default OnePostPage;