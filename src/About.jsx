
function About() {
  
    function btn1() {
      console.log("로그1");
    }

    const btn2 = () => {
      console.log("로그2");
    }
    return (
      <>
        <p>Hello About!</p>
        <p><button onClick={btn1}>버튼111</button></p>
        <p><button onClick={() => btn2()}>버튼222</button></p>
      </>
    )
  }
  
  export default About