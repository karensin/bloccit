const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;


describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {

// #2
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user

// #3
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",

// #4
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {

// #5
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic; //store the topic
          this.post = topic.posts[0]; //store the post
          done();
        })
      })
    });
  });
  describe("#create()", () => {
        it("should create a post object with a title, body, and assigned topic", (done) => {

            Topic.create({
                title: "Are dog toys safe enough for both owners and dogs",
                description: "Tests and feedback from users",
                topicId: this.topic.id
            })
            .then((topic) => {
                expect(topic.title).toBe("Are dog toys safe enough for both owners and dogs");
                expect(topic.description).toBe("Tests and feedback from users");
                done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });

         it("should not create a post with missing title or description", (done) => {
            Topic.create({
                title: "Are dog toys safe enough for both owners and dogs",
            })
            .then((topic) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Topic.description cannot be null");
                done();
            })
        });
    });

    describe("#setTopic()", () => {

 		it("should associate a topic and a post together", (done) => {

 			Topic.create({
 				title: "Dog Toys",
 				description: "Dog toys should be safe"
 			})
 			.then((newTopic) => {
 				expect(this.post.topicId).toBe(this.topic.id);

 				this.post.setTopic(newTopic)
 				.then((post) => {
 					expect(post.topicId).toBe(newTopic.id);
 					done();
 				});
 			})
 		});
  });

    describe("#getPosts()", () => {

  			it("should return the associated posts", (done) => {
  				this.topic.getPosts()
  				.then((associatedPosts) => {
  					expect(associatedPosts[0].title);
  					done();
  			});
  		});
  	});
  });
