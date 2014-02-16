var User = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        email: '',
        username: '',
        fullname: '',
        age: 0,
        location: '',
        gender: ''
    },
    urlRoot: '/users'
});

var UserView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template('<td><a href="#" class="linkshowuser" title="Show Details"><%= username %></td><td><%= email %></td><td><a href="#" class="linkdeleteuser">delete</a></td>'),

    events: {
        'click .linkshowuser': 'showUserInfo',
        'click .linkdeleteuser': 'deleteUser'
    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
       this.$el.html(this.template(this.model.attributes));
       return this;
    },

    showUserInfo: function(event) {
        event.preventDefault();

        $('#userInfoName').text(this.model.get('fullname'));
        $('#userInfoAge').text(this.model.get('age'));
        $('#userInfoGender').text(this.model.get('gender'));
        $('#userInfoLocation').text(this.model.get('location'));
    }, 

    deleteUser: function() {
        var confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation === true) {
            console.log(this.model);
            this.model.destroy();
        } else {
            return false;
        }
    }
})

var UserCollection = Backbone.Collection.extend({
    model: User,
    url: '/users'
});

var AppView = Backbone.View.extend({
    el: '#wrapper',

    $userTable: $('#userList table tbody'),

    events: {
        'click #addUser': 'addUser'
    },

    initialize: function() {
        $userTable = this.$userTable;
        this.$userTable.empty();

        users = new UserCollection();
        this.users = users;
        users.fetch({
            success: function() {
                users.each(function(user) {
                    this.$userTable.append(new UserView({model: user}).render());
                });
            }
        });
        this.listenTo(this.users, 'add', this.addOne);
    },

    render: function() {
        return this;
    },

    addUser: function() {
        this.users.create({
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        });
    },

    addOne: function(user) {
        console.log('addOne');
        var view = new UserView({model: user});
        this.$userTable.append(view.render().el);
    }
});

var AppRoute = Backbone.Router.extend({
    routes: {
        '*path': 'main'
    },

    main: function(path) {
        console.log('main' + path);
        new AppView();
    }
});

$(function () {
    new AppRoute();
    Backbone.history.start();
});
