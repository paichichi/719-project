window.addEventListener("load", function(){

    //matching class from the the whole-comment div...
    const comments = document.querySelector("#comment-display");

    //matching show&hide button...
    const toggleButton = document.querySelector("#toggle");

    //when user click...
    toggleButton.addEventListener("click", function(){
        //toggle to show and hide...
        comments.classList.toggle("comment-dispear");
    });

    //matching submit button...
    const submitComments = document.querySelector("#submit");

    //matching comment display div...
    const commentDisplay = document.querySelector("#comment-display");

    //when user click, this funciton will call...
    submitComments.addEventListener("click", commentreFresh);
    
    //matching small icon, like thumb up, thumb down, and delete...
    const iconButton = this.document.querySelectorAll(".small-icon");

    //when user cilck the icon, this function will call..
    iconButton.forEach(function(ele){
        ele.addEventListener("click", commentreFresh);
    });

    //matching parent reply href...
    const replyToggle = document.querySelectorAll(".replyToggle");

    //matching the child comment input box...
    const replyPopup1 = document.querySelectorAll(".replyPopup1");
    replyToggle.forEach(function(ele, count){

        //when people click the reply href, toggle show and hide...
        ele.addEventListener("click", function(){
            replyPopup1[count].classList.toggle("replyPopup2");
        });
    });
    
    //matching child comment submit button...
     const submit_second = document.querySelectorAll(".submit-second");

     //when people click the submit button, this function will call...
     submit_second.forEach(function(ele){
         ele.addEventListener("click", commentreFresh);
     })

     // this function can be called, using AJAX/Fetch to retrieve all comments and display...
     async function commentreFresh(){
        let request = await fetch(`http://localhost:3000/commentUpdate`);
        let allComments = await request.json();

        //reset the comment div...
        commentDisplay.innerHTML = "";
        for(let i = 0; i < allComments.length; i++){

            //using loop to write all comment...
            commentDisplay.innerHTML += `
            <div class="comment-card">
                <div class="comment-avater">
                    <img class="comment-image" src="./images/avatars/${allComments[i].avatar}.png">
                </div>
                <div class="comment-contents">
                    <div class="comment-title">
                        <p class="comment-username">${allComments[i].username}</p>
                        <p class="comment-time">${allComments[i].timestamp}</p>
                        <a href="./voteCommentUp?id=${allComments[i].id}"><img src="./images/avatars/up.png" class="small-icon"></a><p>${allComments[i].upvote}</p>
                        <a href="./voteCommentDown?id=${allComments[i].id}"><img src="./images/avatars/down.png" class="small-icon"></a><p>${allComments[i].downvote}</p>
                        <a href="./deleteComment?id=${allComments[i].id}"><img src="./images/avatars/delete.png" class="small-icon"></a>
                    </div>
                    <p class="comment-text">${allComments[i].content}</p>
                </div>
            </div>`
        };
        //reload the page but don't jump to the top...
        location.reload();
    };

});