// == 1. Simulate Data Fetching Using Promises: == //

// == 4. Error Handling Simulation: == //
function randomFail() {
  return Math.random() < 0.3; // 30% chance of failing
}

// Simulate fetching user profile:
function fetchUserProfile() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomFail()) {
        reject("Failed to fetch user profile");
        return;
      }
      const user = { id: 1, name: "Erin", email: "erinkhollett@gmail.com" };
      resolve(user);
    }, 1000);
  });
}

// Simulate fetching posts for a user:
function fetchPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomFail()) {
        reject("Failed to fetch posts");
        return;
      }
      const posts = [
        { id: 101, userId: 1, title: "First Post" },
        { id: 102, userId: 1, title: "Second Post" }
      ];
      resolve(posts);
    }, 1200);
  });
}

// Simulate fetching comments for a post:
function fetchComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomFail()) {
        reject("Failed to fetch comments");
        return;
      }
      const comments = [
        { id: 201, postId, content: "I liked your post!" },
        { id: 202, postId, content: "Good job." }
      ];
      resolve(comments);
    }, 800);
  });
}

// == 2. Implement Sequential and Parallel Data Fetching: == //

// Sequential Fetching: 
function runSequentialExample() {
  console.log("=== Sequential Fetching Example ===");

  fetchUserProfile()
    .then(user => {
      console.log("User:", user);
      return fetchPosts(user.id);
    })
    .then(posts => {
      console.log("Posts:", posts);
      return fetchComments(posts[0].id);
    })
    .then(comments => {
      console.log("Comments on first post:", comments);
    })
    .catch(err => {
      console.error("Error in sequential flow:", err);
    });
}

// Parallel Fetching: 
function runParallelExample() {
  console.log("=== Parallel Fetching Example ===");

  const userPromise = fetchUserProfile();
  const postsPromise = fetchPosts(1);
  const commentsPromise = fetchComments(101);

  Promise.all([userPromise, postsPromise, commentsPromise])
    .then(([user, posts, comments]) => {
      console.log("User:", user);
      console.log("Posts:", posts);
      console.log("Comments on first post:", comments);
    })
    .catch(err => {
      console.error("Error in parallel flow:", err);
    });
}

// == 3. Refactor with Async/Await: == //
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulate fetching user profile (using async/await):
async function fetchUserProfileAsync() {
  try {
    await delay(1000);
    if (randomFail()) throw new Error("Network issue whie fetching user profile.")
    const user = { id: 1, name: "Erin", email: "erinkhollett@gmail.com" };
    return user;
  } catch(err) {
    throw new Error("Failed to fetch user profile: " + err.message);
  }
}

// Simulate fetching posts for a user (using async/await):
async function fetchPostsAsync(userId) {
  try {
    await delay(1200);
    if (randomFail()) throw new Error("Database timeout while fetching posts.");
    const posts = [
      { id: 101, userId: 1, title: "First Post" },
      { id: 102, userId: 1, title: "Second Post" }
    ];
    return posts;
  } catch (err) {
    throw new Error("Failed to fetch posts: " + err.message);
  }
}

// Simulate fetching comments for a post (using async/await):
async function fetchCommentsAsync(postId) {
  try {
    await delay(800);
    if (randomFail()) throw new Error("API limit exceeded while fetching comments.");
    const comments = [
      { id: 201, postId, content: "I liked your post!" },
      { id: 202, postId, content: "Good job." }
    ];
    return comments;
  } catch (err) {
    throw new Error("Failed to fetch comments: " + err.message);
  }
}

// == 5. Chaining Async Functions: == //
async function getUserContent() {
  let user = null;
  let posts = [];
  let comments = [];

  console.log("=== Async/Await Chaining Example ===")

  try {
    user = await fetchUserProfileAsync();
    console.log("User profile retrieved:", user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error.message);
  }

  if (user) {
    try {
      posts = await fetchPostsAsync(user.id);
      console.log("Posts retrieved:", posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
    }
  } else {
    console.warn("Skipping posts fetch because user profile was not available.")
  }

  if (posts.length > 0) {
    try {
      comments = await fetchCommentsAsync(posts[0].id);
      console.log("Comments retrieved:", comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error.message);
    }
  } else { console.warn("Skipping comments fetch because user profile was not available.")
  }

  console.log("Final combined result:");
  console.log({
    user,
    posts,
    comments
  });
}

// Function that'll run everything with a lag between
async function runAllExamples() {
  runSequentialExample();

  // wait enough time for sequential to finish
  await delay(3500); 

  runParallelExample();

  // wait enough time for parallel to finish
  await delay(1500); 

  await getUserContent();
}

runAllExamples();