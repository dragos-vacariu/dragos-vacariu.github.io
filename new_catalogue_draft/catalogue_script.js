document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.project_div').forEach(div => {
    const video = div.querySelector('.preview_video');

    div.addEventListener('mouseenter', () => {
      if(video){
        video.play().catch(err => console.log('Video play error:', err));
      }
    });

    div.addEventListener('mouseleave', () => {
      if(video){
        video.pause();
        video.currentTime = 0;
      }
    });
  });
});
