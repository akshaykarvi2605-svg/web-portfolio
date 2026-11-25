const el = id => document.getElementById(id);
if(el('carrier')) {
  const form = el('carrier');
  let step=1;
  function showStep(number){
    step=number;
    for(const [section,visible] of [['operation',step===1],['preferences',step===2]]){
      el(section).hidden=!visible;
      el(section).querySelectorAll('select').forEach(select=>select.disabled=!visible);
    }
    el('stage').textContent=step===3?'Carrier intake · Preview':'Carrier intake · Step '+step+' of 2';
    el('intake-title').textContent=['Your operation','Your preferences','Your carrier brief'][step-1];
    form.hidden=step===3;el('back').hidden=step!==2;el('brief').hidden=step!==3;
    el('next').textContent=step===1?'Continue':'Preview brief';
    el('intake-title').focus();
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(step===1){showStep(2);return;}
    el('brief-text').textContent=el('fleet').value+' · '+el('equipment').value+'. Preferred lanes: '+el('lane').value+'. Requested callback: '+el('callback').value.toLowerCase()+'. This sample brief has not been sent.';
    showStep(3);
  });
  el('back').onclick=()=>showStep(1);
  el('restart').onclick=()=>{form.reset();showStep(1);};
}
if(el('editor')){
  const original=[el('headline').textContent,el('excerpt').textContent];
  function view(editing){
    el('editor').hidden=!editing;el('edit').hidden=editing;
    el('reset-article').hidden=editing||(el('headline').textContent===original[0]&&el('excerpt').textContent===original[1]);
    (editing?el('title-input'):el('edit')).focus();
  }
  el('edit').onclick=()=>{el('title-input').value=el('headline').textContent;el('excerpt-input').value=el('excerpt').textContent;el('edit-status').textContent='';view(true);};
  el('cancel').onclick=()=>view(false);
  el('editor').onsubmit=event=>{
    event.preventDefault();
    for(const id of ['title-input','excerpt-input']){
      const field=el(id);field.value=field.value.trim();
      if(!field.reportValidity())return;
    }
    el('headline').textContent=el('title-input').value;el('excerpt').textContent=el('excerpt-input').value;
    view(false);el('edit-status').textContent='Your preview has been updated.';
  };
  el('reset-article').onclick=()=>{el('headline').textContent=original[0];el('excerpt').textContent=original[1];view(false);el('edit-status').textContent='Original sample restored.';};
}
