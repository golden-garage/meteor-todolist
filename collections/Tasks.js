// Tasks.js
// ====================================================================================================================
/*global Tasks:true */


Tasks = new Mongo.Collection( 'tasks' );


// -- publications ----------------------------------------------------------------------------------------------------

if ( Meteor.isServer ) {

    Meteor.publish( 'visibleTasks', function publishVisibleTasks () {

        const filter = { $or: [ { isPrivate: { $ne: true } }, { owner: this.userId } ] };

        return Tasks.find( filter );
    });
}
else {

    Meteor.subscribe( 'visibleTasks' );
}

// -- methods ---------------------------------------------------------------------------------------------------------

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

// -- supporting functions --------------------------------------------------------------------------------------------

function whenAllowed ( taskId, code ) {

    const task   = Tasks.findOne( taskId );
    const userId = Meteor.userId();

    return task.owner === userId && code( taskId );
}

function whenAllowedUpdate ( taskId, $set ) {

    return whenAllowed( taskId, () => Tasks.update( taskId, { $set } ) );
}

// --------------------------------------------------------------------------------------------------------------------

// ====================================================================================================================
