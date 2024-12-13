const API_URL = "http://localhost";

async function getAllPosts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function createPost(post) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post)
        })
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

async function updatePost(postId, post) {
    try {
        const response = await fetch(API_URL + "/" + postId, {
            method: "PUT",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(post)
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

async function deletePost(postId) {
    try {
        const response = await fetch(API_URL + "/" + postId, {
            method: "DELETE",
        })
        if (!response.ok) {
            throw new Error(response.statusText);
        } else {
            console.log(await response.json())
            return "Post wurde gelöscht.";
        }
    } catch (error) {
        console.error(error)
    }
}

const newPost = {
    title: "New Post",
    body: "Inhalt",
    userid: 1
}


const updateP = {
    title: "New Post X",
    body: "Inhalt 2",
    userid: 1
}

let posts = getAllPosts()
let newPostResult = createPost(newPost);
let updatedPost = updatePost(1, updateP);
deletePost(1)