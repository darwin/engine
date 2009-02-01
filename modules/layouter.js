// require('engine')
//#dbg
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
             if (this.layoutChangesGuard<0) {                                                       //#chk
                 console.error("Inconsitent pause/resume on layout changes");                       //#chk
             }                                                                                      //#chk
         },
         /////////////////////////////////////////////////////////////////////////////////////////
         possibleLayoutChange: function(id, reason, anim) {
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
             if (anim!==false) anim = true;
             if (!reason) reason = ""; else reason = " ("+reason+")";
             var layoutingWorker = function() {
                 if (!anim) return el.normalize().enlarge(anim);
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
                 el.normalize().enlarge(anim);
                 PB.unfreezeTime();
             };
             console.log('Layouting'+(anim?"+anim":"")+reason, el);                                //#dbg
             if (PB.layoutingInProgress) {
                 console.log(" --- queued because previous layouting is in progress");              //#dbg  
                 PB.layoutQueued = layoutingWorker;
                 return;
             }
             layoutingWorker();
         }
     });
    
})(jQuery);