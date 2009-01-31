// require('engine')

(function($) {
    
     $.extend(PB, {
         layoutChangesGuard: 0,
         /////////////////////////////////////////////////////////////////////////////////////////
         pauseLayoutChanges: function() {
             this.layoutChangesGuard++;
             this.layoutChangesDirty = false;
         },
         /////////////////////////////////////////////////////////////////////////////////////////
         resumeLayoutChanges: function() {
             this.layoutChangesGuard--;
             if (this.layoutChangesGuard<0) {
                 console.error("Inconsitent pause/resume on layout changes");
                 console.trace();
             }
         },
         /////////////////////////////////////////////////////////////////////////////////////////
         possibleLayoutChange: function(id, noAnim, reason) {
             if (this.disableLayouting) return;
             if (this.layoutChangesGuard) {
                 this.layoutChangesDirty = true;
                 return; // changes are paused
             }
             if (this.mode!="edit") return; // renormalize only in edit mode
             var el = id;
             if (!el) {
                 el = $('.pagebout');
             } else {
                 if (typeof el == "string") el = $(el);
                 el = el.parentsAndMe('.pagebout');
             }
             if (!reason) reason = ""; else reason = " ("+reason+")";
             var layoutingWorker = function() {
                 if (noAnim) return el.normalize().enlarge(!noAnim);
                 // case with animation
                 PB.layoutingInProgress = true;
                 PB.freezeTime();
                 setTimeout(function() {
                     PB.layoutingInProgress = false;
                     if (PB.layoutQueued) {
                         var worker = PB.layoutQueued;
                         PB.layoutQueued = undefined;
                         worker();
                     }
                 }, 500);
                 el.normalize().enlarge(!noAnim);
                 PB.unfreezeTime();
             }
             console.log('Layouting'+reason+(noAnim?"":" with animation"), el);
             if (PB.layoutingInProgress) {
                 console.log(" --- queued because previous layouting is in progress");
                 PB.layoutQueued = layoutingWorker;
                 return;
             }
             layoutingWorker();
         }
     });
    
})(jQuery);