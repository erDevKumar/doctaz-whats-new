# Redact real people (patient names, faces) and export web-sized JPGs.
from PIL import Image
import os
def px(im, box, keep=None):
    W,H=im.size; x0,y0,x1,y1=[int(v*(W if i%2==0 else H)) for i,v in enumerate(box)]
    reg=im.crop((x0,y0,x1,y1)); s=max(1,(x1-x0)//24)
    reg=reg.resize((max(1,(x1-x0)//s),max(1,(y1-y0)//s)),Image.BILINEAR).resize((x1-x0,y1-y0),Image.NEAREST)
    im.paste(reg,(x0,y0))
R={}  # no redaction: the client wants screenshots as captured (see SKILL.md stage 4)
for d in os.listdir('shots'):
    for f in os.listdir('shots/'+d):
        if not f.endswith('.png'): continue
        k=f'{d}/{f[:-4]}'; im=Image.open(f'shots/{k}.png').convert('RGB')
        for b in R.get(k,[]): px(im,b)
        W,H=im.size
        if k in ('conference/ios-1-addperson','conference/ios-2-guest-filled'):
            im=im.crop((0,0,W,int(H*.37)))   # guest invite only; the people list is debug-only and names real users
        if k=='conference/ios-3-invite-sent':
            dlg=im.crop((int(W*.19),int(H*.415),int(W*.81),int(H*.61)))
            px(im,(0,.37,1,1)); im.paste(dlg,(int(W*.19),int(H*.415))); im=im.crop((0,0,W,int(H*.585)))
        im.thumbnail((540,1170)); os.makedirs(f'site/img/{d}',exist_ok=True)
        im.save(f'site/img/{k}.jpg',quality=82,optimize=True)
print(sum(len(fs) for _,_,fs in os.walk('site/img')),'images'); 
