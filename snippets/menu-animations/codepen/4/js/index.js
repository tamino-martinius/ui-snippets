(function() {
  var i, resize;

  i = setInterval(function() {
    return $("div").toggleClass("arrow");
  }, 1500);

  $("div").click(function() {
    clearInterval(i);
    return $("div").toggleClass("arrow");
  });

  resize = function() {
    return $("body").css({
      "margin-top": ~~((window.innerHeight - 200) / 2) + "px"
    });
  };

  $(window).resize(resize);

  resize();

  //get the line lengths
//$("path").each (i) -> console.log @getTotalLength()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLENBQUEsRUFBQTs7RUFBQSxDQUFBLEdBQUksV0FBQSxDQUFZLFFBQUEsQ0FBQSxDQUFBO1dBQ2QsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckI7RUFEYyxDQUFaLEVBRUYsSUFGRTs7RUFJSixDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsS0FBVCxDQUFlLFFBQUEsQ0FBQSxDQUFBO0lBQ2IsYUFBQSxDQUFjLENBQWQ7V0FDQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQjtFQUZhLENBQWY7O0VBSUEsTUFBQSxHQUFTLFFBQUEsQ0FBQSxDQUFBO1dBQ1AsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEdBQVYsQ0FDRTtNQUFBLFlBQUEsRUFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLEdBQXRCLENBQUEsR0FBNkIsQ0FBOUIsQ0FBRixHQUFxQztJQUFuRCxDQURGO0VBRE87O0VBSVQsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsTUFBakI7O0VBQ0EsTUFBQSxDQUFBOztFQWJBOztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaSA9IHNldEludGVydmFsIC0+XG4gICQoXCJkaXZcIikudG9nZ2xlQ2xhc3MgXCJhcnJvd1wiXG4sIDE1MDBcblxuJChcImRpdlwiKS5jbGljayAtPlxuICBjbGVhckludGVydmFsIGlcbiAgJChcImRpdlwiKS50b2dnbGVDbGFzcyBcImFycm93XCJcblxucmVzaXplID0gLT5cbiAgJChcImJvZHlcIikuY3NzXG4gICAgXCJtYXJnaW4tdG9wXCI6IH5+KCh3aW5kb3cuaW5uZXJIZWlnaHQgLSAyMDApIC8gMikgKyBcInB4XCJcbiAgICBcbiQod2luZG93KS5yZXNpemUgcmVzaXplXG5yZXNpemUoKVxuXG4jZ2V0IHRoZSBsaW5lIGxlbmd0aHNcbiMkKFwicGF0aFwiKS5lYWNoIChpKSAtPiBjb25zb2xlLmxvZyBAZ2V0VG90YWxMZW5ndGgoKVxuIl19
//# sourceURL=coffeescript