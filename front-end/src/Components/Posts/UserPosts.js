import React from "react";
import "./Posts.css";
import { getUsers, isLogged, getUsersPosts, PostPostText,
         PostPostPhoto, deletePost, PostPostTag } from '../../api/api';
import arrow_icon from '../../images/arrow-up.png';
import OnePost from '../Posts/OnePost';
import { MentionsInput, Mention } from 'react-mentions';
import { createNotification } from '../../createNotification';
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";

class UserPosts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            logged: this.props.user !== null,
            user: this.props.user,
            error: null,
            postsList: [],
            start: 1,
            end: 10,
            whose: this.props.whose,
            newText: "",
            isUploading: false,
            usersList: [],
            firstFocus: true,
            tagsToPost: [],
            newId: null,
            nomore: false,
        }
        this.asked = [];
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
        this.askPosts = this.askPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.clearAdd = this.clearAdd.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.askTags = this.askTags.bind(this);
        this.filterPost = this.filterPost.bind(this);
        this.addTags = this.addTags.bind(this);
        this.checkScroll = this.checkScroll.bind(this);
    }
    checkScroll = () => {
        //const container = document.getElementById('posts-cont');
        ////console.log("I am checking scroll");
        ////console.log(`${container.scrollHeight} - ${container.scrollTop} == ${container.clientHeight}`)
        //console.log(`${window.scrollY}, ${0.7*document.body.offsetHeight}`);
        if (window.scrollY>=0.5*document.body.offsetHeight) {
            ////console.log(`${container.scrollHeight} - ${container.scrollTop} == ${container.clientHeight}`);
            //console.log("add more")    
            if (!this.asked.includes(this.state.start) && !this.state.nomore) {
                window.removeEventListener('scroll', this.checkScroll);
                setTimeout(()=>{window.addEventListener('scroll', this.checkScroll);}, 2000)            
                this.asked.push(this.state.start);
                setTimeout(()=>{this.nextPage();}, 200);
            }       
                //console.log(`asked:`);
                //console.log(this.asked);            
            //console.log("reached bottom")
        }
    }
    askTags = () => {
        if (this.state.firstFocus) {
            this.setState({
                firstFocus: false,
            })
            getUsers()
            .then(response => {
                //console.log(response);
                let tempL = [];
                response.data.forEach(el => {
                    tempL.push({
                        "id": el.id,
                        "display": el.username,
                    })
                })
                this.setState({
                    usersList: tempL,
                })
            })
            .catch(err => {
                //console.log(err);
            })
        }
    }
    addTags = (text) => {
        // gets post id from: this.state.newId
        // gets tagsList from: this.state.tagsToPost
        this.filterPost(text);
        setTimeout(()=> {
            this.state.tagsToPost.forEach(obj => {
                let id = obj.tag.id;
                let object = {
                    "mentioned": {
                        "id": id,
                    }
                }
                PostPostTag(this.state.newId, object)
                .then(response => {
                    //console.log(response);
                })
                .catch(err => {
                    //console.log(err);
                })
            })
        }, 200)
    }
    filterPost = (text) => {
        //console.log("users i see")
        //console.log(this.state.usersList)
        //console.log("i am filter post");
        let post_text = text;
        //console.log("initial text")
        let final_post_object = [];
        let s3 = [];
        post_text = post_text.replaceAll(")@", ") @");
        //console.log(post_text);
        //let s2 = post_text.trim().split(/\s+/);
        let s2 = post_text.split(' ');
        for (let i=0; i<s2.length; i++) {
            s2[i]+=' ';
        }
        //console.log("after fixing spaces")
        //console.log(s2)
        for (let i=0; i<s2.length; i++) {
            if (s2[i]!==[' ']) {
                //console.log("sublist")
                //console.log(s2[i])
                let subList = s2[i].split('\n');
                //console.log(subList)
                if (subList.length>1) {
                    for (let j=0; j<subList.length-1; j++) {
                        if (!subList[j].endsWith('\n')) {
                            subList[j]+='\n';
                        }    
                        s3.push(subList[j]);
                    }
                    s3.push(subList[subList.length-1])
                }
                else {
                    s3.push(subList);
                }
            }
        }
        //console.log("BROKEN LIST")
        //console.log(s2);
        s3 = s3.flat();
        //console.log(s3);
        s3.forEach(el => {
            //console.log(el)
            if (el.startsWith('@')) {    
                this.state.usersList.forEach(suggest => {
                    let sugg=suggest.display;
                    if (el.startsWith(`@[${sugg}]`)) {
                        let el2 = el.split(')')
                        let dump = el2[1]
                        final_post_object.push({
                            "tag": {
                                "username": suggest.display,
                                "id": suggest.id,
                            },
                            "dump": dump,
                        })
                    }
                })
            }
        })
        //console.log("Tags to post:")
        //console.log(final_post_object)
        this.setState({
            tagsToPost: final_post_object,
        })
    }
    handleInput = (event) => {
        const value = event.target.value;
        this.setState({
            newText: value,
        })
        //console.log(`new text: ${this.state.newText}`);
    }
    clearAdd = () => {
        this.setState({
            newText: "",
        })
        const input = document.getElementById('new-post-photo');
        input.type=''
        input.type='file'             
        createNotification('warning', 'Hello,', 'Publsh was cancelled');
    }
    addPost = () => {
        const input = document.getElementById('new-post-photo');
        let img = null;
        if (input.files.length) {
            img = input.files[0];
            //console.log(img);
        }
        if (!this.state.newText.length && !input.files.length) {
            createNotification('danger', 'Sorry,', 'You cannot create an empty post.')
        }
        else {
            createNotification('success', 'Please wait,', 'We are uploading your post.')
            this.setState({
                isUploading: true,
            })
            // if no text is given
            if (!this.state.newText.length) {
                // just create the post with empty text
                PostPostText(this.state.newText)
                .then(response => {
                    //console.log(response);
                    // then post the photo (has to be there, else the first "if" would have stopped the process)
                    let postId = response.data.id;
                    var bodyFormData = new FormData();
                    bodyFormData.append('image', img);
                    PostPostPhoto(postId, bodyFormData)
                    // if photo posted successfully
                    .then(response => {
                        //console.log(response);
                        let prevText = this.state.newText;
                        this.setState({
                            newText: "",
                            newId: postId,
                            isUploading: false,
                        })
                        const input = document.getElementById('new-post-photo');
                        input.type=''
                        input.type='file'             
                        setTimeout(()=>{this.addTags(prevText);}, 1000)
                        this.askPosts("restart");
                        createNotification('success', 'Hello,', 'Post published successfully.');
                    })
                    // else post has to be deleted (it only has an empty text)
                    .catch(err => {
                        //console.log(err);
                        this.setState({
                            newText: "",
                            isUploading: false,
                        })
                        deletePost(postId)
                        .then(response => {
                            //console.log(response);
                        })
                        .catch(err => {
                            //console.log(err);
                        })
                        createNotification('danger', 'Sorry,', "We couldn't publish your post")
                    })
                })
                // could not create post => return err
                .catch(err => {
                    //console.log(err);
                    this.setState({
                        isUploading: false,
                    })
                    createNotification('danger', 'Sorry,', "We couldn't publish your post")
                })
            }
            else {
                PostPostText(this.state.newText)
                .then(response => {
                    //console.log(response);
                    if(input.files.length) {
                        let postId = response.data.id;
                        var bodyFormData = new FormData();
                        bodyFormData.append('image', img);
                        PostPostPhoto(postId, bodyFormData)
                        // if photo posted successfully
                        .then(response => {
                            //console.log(response);
                            let prevText = this.state.newText;
                            this.setState({
                                newText: "",
                                newId: postId,
                                isUploading: false,
                            })
                            setTimeout(()=>{this.addTags(prevText);}, 1000)
                            this.askPosts("restart");
                            createNotification('success', 'Hello,', 'Post published successfully.');
                        })
                        // else post has to be deleted
                        .catch(err => {
                            //console.log(err);
                            this.setState({
                                newText: "",
                                isUploading: false,
                            })
                            deletePost(postId)
                            .then(response => {
                                //console.log(response);
                            })
                            .catch(err => {
                                //console.log(err);
                            })
                            createNotification('danger', 'Sorry,', "We couldn't publish your post")
                        })
                    }
                    else {
                        let prevText = this.state.newText;
                        this.setState({
                            newText: "",
                            newId: response.data.id,
                            isUploading: false,
                        })
                        setTimeout(()=>{this.addTags(prevText);}, 1000)
                        this.askPosts("restart");
                        createNotification('success', 'Hello,', 'Post published successfully.');
                    }
                })
                // could not create post => return err
                .catch(err => {
                    //console.log(err);
                    this.setState({
                        isUploading: false,
                    })
                    createNotification('danger', 'Sorry,', "We couldn't publish your post")
                })
            }
        }
    }
    moveOn = () => {
        setTimeout(() => this.askPosts(), 500);
    }
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-10,
            end: this.state.end-10,
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+10,
            end: this.state.end+10,
        }), 0)
        this.moveOn();
    }
    askPosts = (how="") => {
        if (how==="restart") {
            this.asked=[];
            this.setState({
                start: 1,
                end: 10,
                postsList: [],
                nomore: false,
            })
        }        
        setTimeout(()=> {
        //console.log(`I asm ask posts with: start=${this.state.start} and asked=${this.asked}`)
        getUsersPosts(this.state.whose, this.state.start, this.state.end)
        .then(response => {
            //console.log(response);
            this.setState({
                postsList: this.state.postsList.concat(response.data),
                nomore: false,
        })
            //console.log(this.state.postsList)
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                nomore: true,
            })
        })}, 1000)
    }
    componentDidMount() {
        window.addEventListener('scroll', this.checkScroll);
        /*isLogged()
        .then(response => {
            //console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
                username: response.data.username,
            });
        })
        .catch(err => {
            //console.log(err);
            this.setState({
                error: err,
            })
        })*/
        setTimeout(()=>this.askPosts(), 200);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.updateMe!==this.props.updateMe) {
            this.askPosts();
        }
        if (prevProps.user!==this.props.user) {
            this.setState({
                user: this.props.user,
                logged: this.props.user !== null,
            })
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkScroll);
    }
    render() {
        return(
            <div className="user-posts-container padding-bottom" style={{marginTop: '5px'}} >
                {this.state.isUploading &&
                    <div style={{'marginBottom': '15px'}} className='center-content margin-top'>
                        <Spinner animation="border" role="status" variant='primary' />
                    </div>
                }
                { (this.state.user?this.state.user.id:null)===this.state.whose && !this.state.isUploading &&
                    <div className="new-post-container">
                            <h5><i>Hi {this.state.username || ''}, what's on your mind?</i></h5>
                            <h6><i>Photo</i></h6>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <input id="new-post-photo" type="file" accept="image/*, video/*"/>
                            <h6><i>Text</i></h6>
                            <hr style={{'marginTop': '0%','marginBottom': '1%'}}></hr>
                            <MentionsInput name="newText" className="post-textarea-edit clean-style new-post" style={{width: '90%'}} value={this.state.newText} onChange={this.handleInput} onFocus={this.askTags}>
                                <Mention
                                    trigger="@"
                                    data={this.state.usersList}
                                    className="mention-suggestions"
                                />
                            </MentionsInput>
                            <div className="flex-layout margin-top-smaller">
                                <Button variant='primary' className="margin" onClick={this.addPost}>Publish</Button>
                                <Button variant='warning' className="margin" onClick={this.clearAdd}>Clear</Button>
                            </div>
                    </div>
                }
                <div style={{'width': '100%'}}>
                    {this.state.postsList.map((value, index) => {
                        return(
                            <OnePost key={index}
                                        id={value.id}
                                        owner={value.owner}
                                        text={value.text}
                                        media={value.media}
                                        video={value.video}
                                        date={value.date}
                                        user={this.state.user}
                                        updateHome={this.props.updateHome}
                                        updateParent={this.askPosts}
                                        user={true}
                                        setShowingMedia={this.props.setShowingMedia}
                                        setImage={this.props.setImage}
                                        setVideo={this.props.setVideo}    
                            />
                        )
                    })}
                </div>
                {!this.state.postsList.length && this.state.nomore &&
                    <div className="error-message margin-top center-text">Oops, no posts found..</div>
                }
                {!this.state.postsList.length && !this.state.nomore &&
                    <div className='center-content margin-top'>
                        <Spinner animation="border" role="status" variant='primary' />
                    </div>
                }
                {window.innerWidht>=500 &&
                    <input type="image" 
                        onClick={ ()=>{      
                            window.scrollTo({
                                top:0,
                                left:0,
                                behavior:'smooth'
                            })}
                        }
                        className="up-button"
                        src={arrow_icon}
                        alt="top-page">
                    </input>
                }
            </div>
        )
    }
}

export default UserPosts;