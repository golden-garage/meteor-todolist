// todo-blaze.js
// ====================================================================================================================
/*global Accounts:true Tasks:true */

Tasks = new Mongo.Collection( 'tasks' );

// --------------------------------------------------------------------------------------------------------------------

if ( Meteor.isServer ) {

    Meteor.publish( 'visibleTasks', function publishTasks () {

        const filter = { $or: [ { isPrivate: { $ne: true } }, { owner: this.userId } ] };

        return Tasks.find( filter );
    });
}


// --------------------------------------------------------------------------------------------------------------------

if ( Meteor.isClient ) {


    // ................................................................................................................

    Meteor.subscribe( 'visibleTasks' );


    // ................................................................................................................

    Template.listTasks.helpers({

        tasks () {

            const hideCompleted = Session.get( 'hideCompleted' );
            const filter        = hideCompleted ? { isChecked: { $ne: true } } : {};
            const sort          = { sort: { createdAt: -1 } };

            return Tasks.find( filter, sort );
        },
    });


    // ................................................................................................................

    Template.newTask.events({

        'submit .new-task' ( event ) {

            const text = event.target.text.value;

            event.preventDefault();

            Meteor.call( 'addTask', text );

            event.target.text.value = '';
        },
    });


    // ................................................................................................................

    Template.checkTask.events({

        'click input[type="checkbox"]' ( event ) {

            event.preventDefault();

            Meteor.call( 'checkTask', this._id, ! this.isChecked, () => {
                const task = Tasks.findOne( this._id );
                event.target.checked = task.isChecked;
            });
        },
    });


    // ................................................................................................................

    Template.deleteTask.events({

        'click button.delete' () {

            Meteor.call( 'deleteTask', this._id );
        },
    });

    // ................................................................................................................

    Template.privateTask.helpers({

        isOwner () { return this.owner === Meteor.userId(); },
    });

    Template.privateTask.events({

        'click button.private' () {

            Meteor.call( 'privateTask', this._id, ! this.isPrivate );
        },
    });

    // ................................................................................................................

    Template.hideCompletedTasks.helpers({

        hideCompleted () { return ! Session.get( 'hideCompleted' ); },
    });

    Template.hideCompletedTasks.events({

        'change input[type="checkbox"]' ( event ) {

            event.preventDefault();

            Session.set( 'hideCompleted', ! Session.get( 'hideCompleted' ) );
        },
    });

    // ................................................................................................................

    Accounts.ui.config({

        passwordSignupFields: 'USERNAME_ONLY',
    });

    // ................................................................................................................
}

// --------------------------------------------------------------------------------------------------------------------

function whenAllowed ( taskId, code ) {

    const task   = Tasks.findOne( taskId );
    const userId = Meteor.userId();

    return task.owner === userId && code( taskId );
}

function whenAllowedUpdate ( taskId, $set ) {

    return whenAllowed( taskId, () => Tasks.update( taskId, { $set } ) );
}

Meteor.methods({

    // ................................................................................................................

    addTask ( text ) {

        // Make sure the user is logged in before inserting a task
        if ( ! Meteor.userId() ) throw new Meteor.Error( 'not-authorized' );

        const createdAt = new Date();
        const owner     = Meteor.userId();
        const username  = Meteor.user().username;
        const isChecked = false;
        const isPrivate = true;

        return Tasks.insert({ text, createdAt, owner, username, isChecked, isPrivate });
    },

    // ................................................................................................................

    deleteTask ( taskId ) { return whenAllowed( taskId, () => Tasks.remove( taskId ) ); },

    // ................................................................................................................

    checkTask ( taskId, isChecked ) { return whenAllowedUpdate( taskId, { isChecked } ); },

    // ................................................................................................................

    privateTask ( taskId, isPrivate ) { return whenAllowedUpdate( taskId, { isPrivate } ); },

    // ................................................................................................................
});

// ====================================================================================================================
