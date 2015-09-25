// hideCompletedTasks/events.js
// ====================================================================================================================

Template.hideCompletedTasks.events({

    'change input[type="checkbox"]' ( event ) {

        event.preventDefault();

        Session.set( 'hideCompleted', ! Session.get( 'hideCompleted' ) );
    },
});

// ====================================================================================================================
