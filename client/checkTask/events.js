// checkTask/events.js
// ====================================================================================================================

Template.checkTask.events({

    'click input[type="checkbox"]' ( event ) {

        event.preventDefault();

        Meteor.call( 'checkTask', this._id, ! this.isChecked, () => {
            const task = Tasks.findOne( this._id );
            event.target.checked = task.isChecked;
        });
    },
});

// ====================================================================================================================
