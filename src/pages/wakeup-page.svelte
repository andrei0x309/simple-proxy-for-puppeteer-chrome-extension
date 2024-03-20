<script lang="ts">
 
    chrome.runtime.sendMessage({action: 'wakeUp'}, function(response) {
      console.log('wakeUp message sent');
    });

  </script>
 
  
  <div class="mainbody" style="min-width: 100%">
     This is a wakeup meant to wakeup the service woker, meant to be used programatically and closed.
  </div>
  
 
  