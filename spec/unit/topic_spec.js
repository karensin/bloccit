const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;


describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "How dog toys can interact with dogs safely ",
        description: " Dog toys that passed the user tests and safety tests are safe for both dogs and owners"
      })
      .then((topic) => {
        this.topic = topic;

        Post.create({
          title: "How to prove dog toys are safe ",
          body: " A series of experiments and tests were conducted",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
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
