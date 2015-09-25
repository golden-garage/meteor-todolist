// listTasks/helpers.js
// ====================================================================================================================

Template.listTasks.helpers({

    tasks () {

        const hideCompleted = Session.get( 'hideCompleted' );
        const filter        = hideCompleted ? { isChecked: { $ne: true } } : {};
        const sort          = { sort: { createdAt: -1 } };

        return Tasks.find( filter, sort );
    },
});

// ====================================================================================================================
