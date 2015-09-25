// newTask/events.js
// ====================================================================================================================

Template.newTask.events({

    'submit .new-task' ( event ) {

        const text = event.target.text.value;

        event.preventDefault();

        Meteor.call( 'addTask', text );

        event.target.text.value = '';
    },
});

// ====================================================================================================================
