"""Generate mobile GLBs without changing meshes, materials or source models. Requires Pillow."""
from pathlib import Path
import json,struct,io,copy,hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def unpack(p):
 b=p.read_bytes();n=struct.unpack_from('<I',b,12)[0]
 return json.loads(b[20:20+n]),b[28+n:]
def make(p):
 original,old=unpack(p);doc=copy.deepcopy(original);replacements=[];sizes=[]
 for im in doc.get('images',[]):
  if 'bufferView' not in im:continue
  v=doc['bufferViews'][im['bufferView']];assert v.get('buffer',0)==0
  a=v.get('byteOffset',0);end=a+v['byteLength'];image=Image.open(io.BytesIO(old[a:end]))
  w,h=image.size
  # One tier lower for ordinary textures; cap large textures at 1K. Tiny labels keep their resolution.
  nw,nh=(max(256,w//2),max(256,h//2)) if max(w,h)>512 else (w,h)
  factor=min(1,1024/max(nw,nh));nw,nh=max(1,round(nw*factor)),max(1,round(nh*factor))
  if (nw,nh)==(w,h):continue
  image=image.resize((nw,nh),Image.Resampling.LANCZOS);out=io.BytesIO()
  if im.get('mimeType')=='image/jpeg':image.convert('RGB').save(out,format='JPEG',quality=88)
  else:image.save(out,format='PNG',optimize=True)
  payload=out.getvalue();replacements.append((a,end,payload,im['bufferView']));sizes.append([w,h,nw,nh])
 replacements.sort();new=bytearray();cursor=0;mapping={}
 for a,end,payload,idx in replacements:
  assert a>=cursor,'Overlapping image ranges'
  new.extend(old[cursor:a]);mapping[idx]=(len(new),len(payload));new.extend(payload)
  # Preserve the relative alignment of all bytes that follow this replacement.
  new.extend(b'\0'*((end-len(new))%4));cursor=end
 new.extend(old[cursor:])
 def shift(offset):
  delta=0
  for a,end,payload,idx in replacements:
   if offset>=end:delta+=len(payload)+(end-(a+delta+len(payload)))%4-(end-a)
   elif offset>a:raise ValueError('A geometry range overlaps an image')
  return offset+delta
 for idx,v in enumerate(doc.get('bufferViews',[])):
  if v.get('buffer',0)==0:
   if idx in mapping:v['byteOffset'],v['byteLength']=mapping[idx]
   else:v['byteOffset']=shift(v.get('byteOffset',0))
  ext=v.get('extensions',{}).get('EXT_meshopt_compression')
  if ext and ext.get('buffer',0)==0:ext['byteOffset']=shift(ext.get('byteOffset',0))
 doc['buffers'][0]['byteLength']=len(new)
 data=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();data+=b' '*((-len(data))%4);new+=b'\0'*((-len(new))%4)
 target=p.parent/'mobile'/p.name;target.parent.mkdir(exist_ok=True)
 target.write_bytes(struct.pack('<III',0x46546c67,2,28+len(data)+len(new))+struct.pack('<II',len(data),0x4e4f534a)+data+struct.pack('<II',len(new),0x004e4942)+new)
 # Every geometry/accessor/animation byte range, including compressed meshopt data, must remain identical.
 for idx,v in enumerate(original.get('bufferViews',[])):
  if idx not in mapping and v.get('buffer',0)==0:
   nv=doc['bufferViews'][idx];assert old[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]==new[nv['byteOffset']:nv['byteOffset']+nv['byteLength']]
  ext=v.get('extensions',{}).get('EXT_meshopt_compression')
  if ext and ext.get('buffer',0)==0:
   ne=doc['bufferViews'][idx]['extensions']['EXT_meshopt_compression'];assert old[ext.get('byteOffset',0):ext.get('byteOffset',0)+ext['byteLength']]==new[ne['byteOffset']:ne['byteOffset']+ne['byteLength']]
 return dict(source=str(p.relative_to(ROOT)),mobile=str(target.relative_to(ROOT)),originalBytes=p.stat().st_size,mobileBytes=target.stat().st_size,textures=sizes,sourceSha256=hashlib.sha256(p.read_bytes()).hexdigest())
paths=[*sorted((ROOT/'duty/big-pengu-runtime/models').glob('*.glb')),*sorted((ROOT/'elevator/models').glob('*.glb'))]
report=[make(p) for p in paths];(ROOT/'mobile/models.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Mobile models:',len(report),'bytes:',sum(r['originalBytes'] for r in report),'->',sum(r['mobileBytes'] for r in report))
